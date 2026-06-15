using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.services.interfaces;

namespace VirtualExcursion.BLL.services
{
    /// <summary>
    /// In-Memory реализация хранилища кодов (для разработки)
    /// </summary>
    public class InMemoryCodeStorage : IVerificationCodeStorage
    {
        private readonly ConcurrentDictionary<string, (string Code, DateTime Expiry)> _storage = new();

        public Task SaveCodeAsync(string email, string code, TimeSpan ttl)
        {
            _storage[email.ToLowerInvariant()] = (code, DateTime.UtcNow.Add(ttl));
            return Task.CompletedTask;
        }

        public Task<string?> GetCodeAsync(string email)
        {
            var key = email.ToLowerInvariant();
            if (_storage.TryGetValue(key, out var entry) && entry.Expiry > DateTime.UtcNow)
            {
                return Task.FromResult<string?>(entry.Code);
            }

            _storage.TryRemove(key, out _);
            return Task.FromResult<string?>(null);
        }

        public Task RemoveCodeAsync(string email)
        {
            _storage.TryRemove(email.ToLowerInvariant(), out _);
            return Task.CompletedTask;
        }
    }
}
