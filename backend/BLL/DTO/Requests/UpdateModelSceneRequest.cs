using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.BLL.DTO.Requests
{
    public class UpdateModelSceneRequest
    {
        public int Id { get; set; }
        public int SceneId { get; set; }
        public string ModelUrl { get; set; }
        public string ModelFormat { get; set; }
        public float CameraStartX { get; set; }
        public float CameraStartY { get; set; }
        public float CameraStartZ { get; set; }
        public float CameraTargetX { get; set; }
        public float CameraTargetY { get; set; }
        public float CameraTargetZ { get; set; }
        public float AmbientLightIntensity { get; set; }
        public bool EnableVR { get; set; }
    }
}
