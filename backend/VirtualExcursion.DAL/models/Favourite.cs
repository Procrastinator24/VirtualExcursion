using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.DAL.models
{
    public class Favourite
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public virtual User User { get; set; } = null!;

        public int? ExcursionId { get; set; }
        public virtual Excursion? Excursion { get; set; }

        public int? SceneId { get; set; }
        public virtual Scene? Scene { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
