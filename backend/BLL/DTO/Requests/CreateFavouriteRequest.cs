using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.BLL.DTO.Requests
{
    public class CreateFavouriteRequest
    {
        public int? ExcursionId { get; set; }
        public int? SceneId { get; set; }
    }
}
