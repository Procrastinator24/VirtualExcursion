using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.DAL.models
{
    public class POI
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public float CoordinateX { get; set; }
        public float CoordinateY { get; set; }
        public float CoordinateZ { get; set; }
        public int SceneId { get; set; }
        public string? MediaUrl { get; set; }
        public string IconType { get; set; } = "info"; 
        public virtual Scene? Scene { get; set; }
    }
}
