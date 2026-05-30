using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.BLL.DTO.Requests
{
    public class ReorderExcursionScenesRequest
    {
        public int ExcursionId { get; set; }
        public List<SceneOrderDto> SceneOrders { get; set; } = new();
    }

    public class SceneOrderDto
    {
        public int SceneId { get; set; }
        public int Order { get; set; }
    }
}
