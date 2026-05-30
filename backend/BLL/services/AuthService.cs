using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;
using VirtualExcursion.BLL.services.interfaces;
using VirtualExcursion.DAL.models;
using VirtualExcursion.DAL.Repositories.interfaces;
using static VirtualExcursion.BLL.DTO.Requests.RegisterRequest;

namespace VirtualExcursion.BLL.services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IGuideProfileRepository _guideProfileRepository;
        private readonly IPasswordHashingService _passwordHasher;
        private readonly IVerificationCodeStorage _codeStorage;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly Random _random = new();

        // Лимиты для безопасности
        private const int MaxCodeAttempts = 5;
        private static readonly ConcurrentDictionary<string, int> _failedAttempts = new();
        private static readonly ConcurrentDictionary<string, DateTime> _blockedUntil = new();

        public AuthService(
            IUserRepository userRepository,
            IGuideProfileRepository guideProfileRepository,
            IPasswordHashingService passwordHasher,
            IVerificationCodeStorage codeStorage,
            IEmailService emailService,
            IConfiguration configuration,
            IMapper mapper)
        {
            _userRepository = userRepository;
            _guideProfileRepository = guideProfileRepository;
            _passwordHasher = passwordHasher;
            _codeStorage = codeStorage;
            _emailService = emailService;
            _configuration = configuration;
            _mapper = mapper;
        }

        /// <summary>
        /// Отправить код подтверждения на email
        /// </summary>
        public async Task SendVerificationCodeAsync(string email)
        {
            email = email.ToLowerInvariant();

            // Проверка на блокировку
            if (_blockedUntil.TryGetValue(email, out var blockUntil) && blockUntil > DateTime.UtcNow)
            {
                var remainingSeconds = (int)(blockUntil - DateTime.UtcNow).TotalSeconds;
                throw new InvalidOperationException($"Слишком много попыток. Попробуйте через {remainingSeconds} секунд.");
            }

            // Проверка, не зарегистрирован ли уже пользователь
            //if (await _userRepository.ExistsByEmail(email))
            //{
            //    throw new InvalidOperationException("Пользователь с таким email уже зарегистрирован");
            //}

            // Генерация 4-значного кода
            var code = _random.Next(1000, 9999).ToString();

            // Сохраняем код в кэш (живёт 5 минут)
            await _codeStorage.SaveCodeAsync(email, code, TimeSpan.FromMinutes(5));

            // Отправляем код на email
            await _emailService.SendVerificationCodeAsync(email, code);
        }

        /// <summary>
        /// Проверить код подтверждения
        /// </summary>
        public async Task VerifyCodeAsync(string email, string code)
        {
            email = email.ToLowerInvariant();

            // Проверка на блокировку
            if (_blockedUntil.TryGetValue(email, out var blockUntil) && blockUntil > DateTime.UtcNow)
            {
                var remainingSeconds = (int)(blockUntil - DateTime.UtcNow).TotalSeconds;
                throw new InvalidOperationException($"Слишком много попыток. Попробуйте через {remainingSeconds} секунд.");
            }

            var storedCode = await _codeStorage.GetCodeAsync(email);

            if (string.IsNullOrEmpty(storedCode))
            {
                throw new InvalidOperationException("Код не найден или истёк. Запросите новый код.");
            }

            if (storedCode != code)
            {
                // Увеличиваем счётчик неудачных попыток
                var attempts = _failedAttempts.AddOrUpdate(email, 1, (_, count) => count + 1);

                if (attempts >= MaxCodeAttempts)
                {
                    _blockedUntil[email] = DateTime.UtcNow.AddMinutes(15);
                    _failedAttempts.TryRemove(email, out _);
                    throw new InvalidOperationException("Слишком много неверных попыток. Доступ заблокирован на 15 минут.");
                }

                throw new InvalidOperationException($"Неверный код. Осталось попыток: {MaxCodeAttempts - attempts}");
            }

            // Код верный — очищаем счётчик попыток и удаляем использованный код
            _failedAttempts.TryRemove(email, out _);
            await _codeStorage.RemoveCodeAsync(email);
        }

        /// <summary>
        /// Регистрация нового пользователя с подтверждённым кодом
        /// </summary>
        public async Task<AuthResponse> RegisterWithCodeAsync(RegisterWithCodeRequest request)
        {
            var email = request.Email.ToLowerInvariant();

            // Проверяем, что код уже был верифицирован (опционально, т.к. код уже удалён после верификации)
            // В нашем флоу фронт сначала вызывает /verify-code, а потом /register
            // Поэтому здесь мы просто верим, что фронт уже проверил код

            if (await _userRepository.ExistsByEmail(email))
            {
                throw new InvalidOperationException("Пользователь с таким email уже существует");
            }

            var user = new User
            {
                Username = request.Name,
                Email = email,
                PasswordHash = _passwordHasher.HashPassword(request.Password),
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow
            };

            var createdUser = await _userRepository.Create(user);

            // Создаём GuideProfile? Нет, только по желанию пользователя (отдельный процесс)
            // Пока просто возвращаем токен

            var token = GenerateJwtToken(createdUser);
            var expiresAt = DateTime.UtcNow.AddMinutes(GetExpireMinutes());

            return new AuthResponse
            {
                Id = createdUser.Id,
                Name = createdUser.Username,
                Email = createdUser.Email,
                Token = token,
                TokenExpiresAt = expiresAt,
                Role = createdUser.Role.ToString(),
                HasGuideProfile = createdUser.GuideProfile != null
            };
        }

        /// <summary>
        /// Вход в систему
        /// </summary>
        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var email = request.Email.ToLowerInvariant();
            var user = await _userRepository.GetByEmail(email);

            if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Неверный email или пароль");
            }

            var token = GenerateJwtToken(user);
            var expiresAt = DateTime.UtcNow.AddMinutes(GetExpireMinutes());

            return new AuthResponse
            {
                Id = user.Id,
                Name = user.Username,
                Email = user.Email,
                Token = token,
                TokenExpiresAt = expiresAt,
                Role = user.Role.ToString(),
                HasGuideProfile = user.GuideProfile != null
            };
        }

        public async Task<UserResponse> GetCurrentUserAsync(int userId)
        {
            var user = await _userRepository.GetById(userId);
            if (user == null)
                throw new KeyNotFoundException("Пользователь не найден");

            return _mapper.Map<UserResponse>(user);
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(GetExpireMinutes()),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private int GetExpireMinutes()
        {
            return int.TryParse(_configuration["Jwt:ExpireMinutes"], out var minutes) ? minutes : 60;
        }
    }
}
