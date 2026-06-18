using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.DAL.models
{
    public class VideoScene
    {
        public int Id { get; set; }
        public int SceneId { get; set; }
        public virtual Scene Scene { get; set; }
        public string VideoUrl { get; set; }
        public int? DurationSeconds { get; set; }
    }
}
