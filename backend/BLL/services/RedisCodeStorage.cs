using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.services.interfaces;

//namespace VirtualExcursion.BLL.services
//{
//    /// <summary>
//    /// Redis реализация хранилища кодов (для продакшена)
//    /// </summary>
//    public class RedisCodeStorage : IVerificationCodeStorage
//    {
//        private readonly IDatabase _redis;
//        private const string KeyPrefix = "email_code:";

//        public RedisCodeStorage(IConnectionMultiplexer redis)
//        {
//            _redis = redis.GetDatabase();
//        }

//        public async Task SaveCodeAsync(string email, string code, TimeSpan ttl)
//        {
//            var key = $"{KeyPrefix}{email.ToLowerInvariant()}";
//            await _redis.StringSetAsync(key, code, ttl);
//        }

//        public async Task<string?> GetCodeAsync(string email)
//        {
//            var key = $"{KeyPrefix}{email.ToLowerInvariant()}";
//            return await _redis.StringGetAsync(key);
//        }

//        public async Task RemoveCodeAsync(string email)
//        {
//            var key = $"{KeyPrefix}{email.ToLowerInvariant()}";
//            await _redis.KeyDeleteAsync(key);
//        }
//    }
//}
