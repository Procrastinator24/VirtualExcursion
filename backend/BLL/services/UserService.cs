using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;
using VirtualExcursion.BLL.services.interfaces;
using VirtualExcursion.DAL.models;
using VirtualExcursion.DAL.Repositories;
using VirtualExcursion.DAL.Repositories.interfaces;

namespace VirtualExcursion.BLL.services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;
        private readonly IMapper _mapper;
        public UserService(IUserRepository repository, IMapper mapper) 
        {
            _mapper = mapper;
            _repository = repository;
        }


        public async Task<UserResponse> Create(CreateUserRequest request)
        {
            var newUser = _mapper.Map<User>(request); //TODO: Хэширование пароля 
            var createduser = await _repository.Create(newUser);
            var response = _mapper.Map<UserResponse>(createduser);
            return response;
        }

        public async Task<bool> Delete(int id)
        {
            var result = await _repository.Delete(id);
            return result;
        }

        public async Task<List<UserResponse>> Get()
        {
            var users = await _repository.GetUsers();
            var response = _mapper.Map<List<UserResponse>>(users);
            return response;
        }

        public async Task<UserResponse> GetById(int id)
        {
            var response = _mapper.Map<UserResponse>(await _repository.GetById(id));
            return response;
        }

        public async Task<UserResponse> GetByEmail(string email)
        {
            var response = _mapper.Map<UserResponse>(_repository.GetByEmail(email));
            return response;
        }

        public async Task<UserResponse> Update(UpdateUserRequest request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            var existing = await _repository.GetById(request.Id);
            if (existing == null)
                throw new KeyNotFoundException("Пользователь не найден");

            // Обновляем только то, что пришло
            if (request.Username != null)
                existing.Username = request.Username;

            if (request.Email != null)
                existing.Email = request.Email;

            if (request.AvatarUrl != null)
                existing.AvatarUrl = request.AvatarUrl;

            if (request.IsAdmin.HasValue)
                existing.IsAdmin = request.IsAdmin.Value;

            var updated = await _repository.Update(existing);
            return _mapper.Map<UserResponse>(updated);
        }
    }
}
