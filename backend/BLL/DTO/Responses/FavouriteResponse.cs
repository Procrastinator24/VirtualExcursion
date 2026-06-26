using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.BLL.DTO.Responses
{
    public class FavouriteResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string WorkspaceName { get; set; } = string.Empty;
        public int? ExcursionId { get; set; }
        public ExcursionShortResponse? Excursion { get; set; }
        public int? SceneId { get; set; }
        public SceneShortResponse? Scene { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
