using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
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

namespace VirtualExcursion.BLL.services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHashingService _passwordHasher;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public AuthService(IUserRepository repository, IPasswordHashingService passwordHashingService, 
            IConfiguration configuration, IMapper mapper)
        {
            _userRepository = repository;
            _passwordHasher = passwordHashingService;
            _mapper = mapper;
            _configuration = configuration;

        }
        public async Task<UserResponse> GetCurrentUser(int userId)
        {
            var user = await _userRepository.GetById(userId);

            if (user == null)
                throw new KeyNotFoundException("Пользователь не найден");

            return _mapper.Map<UserResponse>(user);
        }

        public async Task<AuthResponse> Login(LoginRequest request)
        {
            // Поиск пользователя
            var user = await _userRepository.GetByEmail(request.Email);

            if (user == null)
                throw new UnauthorizedAccessException("Неверный email или пароль");

            // Проверка пароля
            if (!_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Неверный email или пароль");

            // Генерируем токен
            var token = GenerateJwtToken(user);

            return new AuthResponse
            {
                Id = user.Id,
                Name = user.Username,
                Email = user.Email,
                Token = token,
                TokenExpiresAt = DateTime.UtcNow.AddMinutes(GetExpireMinutes()),
                HasGuideProfile = user.GuideProfile != null
            };
        }

        public async Task<AuthResponse> Register(RegisterRequest request)
        {
            if (await _userRepository.ExistsByEmail(request.Email))
                throw new InvalidOperationException("Пользователь с таким email уже существует");

            // Создаем пользователя
            var user = new User
            {
                Username = request.Name,
                Email = request.Email,
                PasswordHash = _passwordHasher.HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow
            };

            var createdUser = await _userRepository.Create(user);

            // Генерируем токен
            var token = GenerateJwtToken(createdUser);

            return new AuthResponse
            {
                Id = createdUser.Id,
                Name = createdUser.Username,
                Email = createdUser.Email,
                Token = token,
                TokenExpiresAt = DateTime.UtcNow.AddMinutes(GetExpireMinutes()),
                HasGuideProfile = createdUser.GuideProfile != null
            };

        }
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.UserRole)
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
