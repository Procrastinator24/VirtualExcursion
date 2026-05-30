using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.DAL.Repositories.interfaces
{
    public interface IFavouriteRepository
    {
        Task<List<Favourite>> GetByUserId(int userId);
        Task<Favourite?> GetByUserAndExcursion(int userId, int excursionId);
        Task<Favourite?> GetByUserAndScene(int userId, int sceneId);
        Task<Favourite> Create(Favourite favourite);
        Task<bool> Delete(int id);
        Task<bool> IsFavourite(int userId, int? excursionId, int? sceneId);
    }
}
