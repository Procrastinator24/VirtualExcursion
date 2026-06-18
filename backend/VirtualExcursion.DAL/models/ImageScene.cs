using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.DAL.models
{
    public class ImageScene
    {  
        public int Id { get; set; }
        public int SceneId { get; set; }
        public virtual Scene Scene { get; set; }
        public string ImageUrl { get; set; }
        public int? Width { get; set; }
        public int? Height { get; set; }

    }
}
