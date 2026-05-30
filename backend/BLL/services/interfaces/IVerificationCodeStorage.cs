using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.BLL.services.interfaces
{
    /// <summary>
    /// Хранилище кодов подтверждения email
    /// </summary>
    public interface IVerificationCodeStorage
    {
        /// <summary>
        /// Сохранить код для email
        /// </summary>
        Task SaveCodeAsync(string email, string code, TimeSpan ttl);

        /// <summary>
        /// Получить код по email (если не истёк)
        /// </summary>
        Task<string?> GetCodeAsync(string email);

        /// <summary>
        /// Удалить код по email
        /// </summary>
        Task RemoveCodeAsync(string email);
    }
}
