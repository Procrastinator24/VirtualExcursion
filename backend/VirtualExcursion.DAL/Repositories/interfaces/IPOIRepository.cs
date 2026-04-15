using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.DAL.Repositories.interfaces
{
    public interface IPOIRepository
    {
        Task<List<POI>> Get();
        Task<List<POI>> GetBySceneId(int sceneId);
        Task<POI> GetById(int id);
        Task<POI> Create(POI POI);
        Task<POI> Update(POI POI);
        Task<bool> Delete(int id);
        Task<bool> Exists(int id);
    }
}
