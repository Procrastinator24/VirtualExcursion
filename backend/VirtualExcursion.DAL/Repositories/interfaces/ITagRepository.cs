using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.DAL.Repositories.interfaces
{
    public interface ITagRepository
    {
        Task<List<Tag>> Get();
        Task<Tag> GetById(int id);
        Task<Tag> GetBySlug(string slug);
        /// <summary>
        /// Добавить тег к сцене
        /// </summary>
        Task AddToScene(int sceneId, int tagId);

        /// <summary>
        /// Удалить тег у сцены
        /// </summary>
        Task RemoveFromScene(int sceneId, int tagId);

        /// <summary>
        /// Получить все теги сцены
        /// </summary>
        Task<List<Tag>> GetTagsForScene(int sceneId);
        Task<Tag> Create(Tag tag);
        Task<Tag> Update(Tag tag);
        Task<bool> Delete(int id);
        Task<bool> Exists(int id);
        Task<bool> ExistsBySlug(string slug, int? excludeId = null);
    }
}
