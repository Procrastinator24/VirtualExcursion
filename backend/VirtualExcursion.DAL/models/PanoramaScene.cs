using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.DAL.models
{
    public class PanoramaScene
    {
        public int Id { get; set; }
        public int SceneId { get; set; }
        public virtual Scene Scene { get; set; }
        public string PanoramaUrl { get; set; }
    }
}
