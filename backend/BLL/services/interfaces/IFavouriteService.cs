using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;

namespace VirtualExcursion.BLL.services.interfaces
{
    public interface IFavouriteService
    {
        Task<List<FavouriteResponse>> GetUserFavourites(int userId);
        Task<FavouriteResponse> AddFavourite(int userId, CreateFavouriteRequest request);
        Task<bool> RemoveFavourite(int favouriteId);
        Task<bool> IsFavourite(int userId, int? excursionId, int? sceneId);
    }
}
