using Azure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.DAL.models
{
    public class SceneTag
    {
        public int SceneId { get; set; }
        public int TagId { get; set; }

        // Navigation
        public Scene Scene { get; set; } = null!;
        public Tag Tag { get; set; } = null!;
    }
}
