using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.services.interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace VirtualExcursion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public UserController(IUserService userService, ILogger<UserController> logger, IWebHostEnvironment webHostEnvironment)
        {
            _userService = userService;
            _logger = logger;
            _webHostEnvironment = webHostEnvironment;
        }
        // GET: api/<UserController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var response = await _userService.Get();
            return Ok(response);
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _userService.GetById(id);
            return Ok(response);
        }
        // GET api/<UserController>/5
        [HttpGet("{email}")]
        public async Task<IActionResult> GetById(string email)
        {
            var response = await _userService.GetByEmail(email);
            return Ok(response);
        }
        // POST api/<UserController>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserRequest request)
        {
            var response = await _userService.Create(request);
            return Ok(response);
        }

        // PUT api/<UserController>
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateUserRequest request)
        {
            var response = await _userService.Update(request);
            return Ok(response);
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _userService.Delete(id);
            return Ok(response);
        }
        /// <summary>
        /// Загрузить обложку для экскурсии
        /// </summary>
        /// <param name="file">Файл изображения (JPG, JPEG, PNG, WEBP)</param>
        /// <remarks>
        /// Загружает изображение на сервер и возвращает URL для доступа к нему.
        /// Максимальный размер файла — 5 МБ.
        /// </remarks>
        /// <response code="200">Файл успешно загружен. Возвращает URL загруженного файла.</response>
        /// <response code="400">Ошибка: файл не выбран, превышен размер или недопустимый формат.</response>
        /// <response code="500">Внутренняя ошибка сервера.</response>
        [HttpPost("upload-avatar")]
        public async Task<IActionResult> UploadBanner(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest(new { error = "No file uploaded" });

                if (file.Length > 5 * 1024 * 1024)
                    return BadRequest(new { error = "File size exceeds 5 MB" });

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(extension))
                    return BadRequest(new { error = "Invalid file type. Allowed: jpg, jpeg, png, webp" });

                var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "avatars");

                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var url = $"/avatars/{uniqueFileName}";
                return Ok(new { url });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading avatar");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }
    }
}
