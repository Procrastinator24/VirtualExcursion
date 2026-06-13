using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;
using VirtualExcursion.BLL.services.interfaces;
using static VirtualExcursion.BLL.DTO.Requests.RegisterRequest;

namespace VirtualExcursion.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Отправить код подтверждения на email
        /// </summary>
        /// <remarks>
        /// 1. Проверяет, не зарегистрирован ли уже пользователь с таким email
        /// 2. Генерирует 4-значный код
        /// 3. Сохраняет код в кэш на 5 минут
        /// 4. Отправляет код на указанный email через SMTP
        /// </remarks>
        /// <param name="request">Email пользователя</param>
        /// <response code="200">Код успешно отправлен</response>
        /// <response code="400">Неверный email или пользователь уже существует</response>
        /// <response code="500">Внутренняя ошибка сервера</response>
        [HttpPost("send-code")]
        public async Task<IActionResult> SendCode([FromBody] SendCodeRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                await _authService.SendVerificationCodeAsync(request.Email);
                _logger.LogInformation("Код подтверждения отправлен на {Email}", request.Email);

                return Ok(new { message = "Код подтверждения отправлен на указанный email" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при отправке кода на {Email}", request.Email);
                return StatusCode(500, new { error = "Внутренняя ошибка сервера" });
            }
        }

        /// <summary>
        /// Проверить код подтверждения
        /// </summary>
        /// <remarks>
        /// 1. Проверяет, существует ли код для указанного email
        /// 2. Проверяет, не истёк ли код (5 минут)
        /// 3. Проверяет количество попыток (не более 5)
        /// 4. При успехе удаляет код из кэша
        /// </remarks>
        /// <param name="request">Email и код подтверждения</param>
        /// <response code="200">Код подтверждён</response>
        /// <response code="400">Неверный или истёкший код</response>
        /// <response code="500">Внутренняя ошибка сервера</response>
        [HttpPost("verify-code")]
        public async Task<IActionResult> VerifyCode([FromBody] VerifyCodeRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                await _authService.VerifyCodeAsync(request.Email, request.Code);

                return Ok(new { message = "Код подтверждён" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при проверке кода для {Email}", request.Email);
                return StatusCode(500, new { error = "Внутренняя ошибка сервера" });
            }
        }

        /// <summary>
        /// Завершить регистрацию после подтверждения кода
        /// </summary>
        /// <remarks>
        /// 1. Проверяет, что пользователь с таким email не существует
        /// 2. Создаёт нового пользователя
        /// 3. Хеширует пароль с помощью BCrypt
        /// 4. Генерирует JWT-токен для автоматического входа
        /// </remarks>
        /// <param name="request">Данные для регистрации (email, код, имя, пароль)</param>
        /// <response code="200">Пользователь создан, возвращён JWT-токен</response>
        /// <response code="400">Ошибка валидации или код не подтверждён</response>
        /// <response code="409">Пользователь с таким email уже существует</response>
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterWithCodeRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _authService.RegisterWithCodeAsync(request);
                _logger.LogInformation("Зарегистрирован новый пользователь: {Email}", request.Email);

                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при регистрации пользователя {Email}", request.Email);
                return StatusCode(500, new { error = "Внутренняя ошибка сервера" });
            }
        }

        /// <summary>
        /// Вход в систему
        /// </summary>
        /// <remarks>
        /// 1. Проверяет существование пользователя
        /// 2. Проверяет пароль (BCrypt)
        /// 3. Генерирует JWT-токен (access token)
        /// 4. Сохраняет refresh token в БД
        /// </remarks>
        /// <param name="request">Email и пароль</param>
        /// <response code="200">Успешный вход, возвращён JWT-токен</response>
        /// <response code="400">Ошибка валидации</response>
        /// <response code="401">Неверный email или пароль</response>
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _authService.LoginAsync(request);
                _logger.LogInformation("Пользователь {Email} вошёл в систему", request.Email);

                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при входе пользователя {Email}", request.Email);
                return StatusCode(500, new { error = "Внутренняя ошибка сервера" });
            }
        }

        /// <summary>
        /// Получить информацию о текущем пользователе
        /// </summary>
        /// <remarks>
        /// Требует авторизации. Пользователь определяется по JWT-токену из заголовка Authorization.
        /// </remarks>
        /// <response code="200">Данные пользователя</response>
        /// <response code="401">Токен отсутствует или недействителен</response>
        /// <response code="404">Пользователь не найден</response>
        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserResponse>> GetCurrentUser()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                    return Unauthorized();

                var userId = int.Parse(userIdClaim.Value);
                var result = await _authService.GetCurrentUserAsync(userId);

                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении текущего пользователя");
                return StatusCode(500, new { error = "Внутренняя ошибка сервера" });
            }
        }

        
        //[Authorize]
        //[HttpPost("logout")]
        //public IActionResult Logout()
        //{
        //    // В JWT-based аутентификации сервер обычно ничего не делает,
        //    // клиент сам удаляет токен. Но можно добавить логику с черным списком токенов.
        //    return Ok(new { message = "Выход выполнен" });
        //}
    }
}