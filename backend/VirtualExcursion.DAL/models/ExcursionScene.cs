using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.DAL.models
{
    public class ExcursionScene
    {
        public int ExcursionId { get; set; }
        public virtual Excursion Excursion { get; set; } = null!;

        public int SceneId { get; set; }
        public virtual Scene Scene { get; set; } = null!;

        public int Order { get; set; } = 0;  
    }
}
