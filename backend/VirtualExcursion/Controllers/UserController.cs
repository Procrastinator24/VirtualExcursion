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

        public UserController(IUserService userService)
        {
            _userService = userService;
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
    }
}
