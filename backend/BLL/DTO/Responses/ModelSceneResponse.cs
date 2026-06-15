using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.BLL.DTO.Responses
{
    public class ModelSceneResponse()
    {
        public int Id { get; set; }
        public int SceneId { get; set; }
        public string SceneName { get; set; } // название связанной сцены
        public string ModelUrl { get; set; }
        public string Author { get; set; }
        public string Description { get; set; }
        public string ModelFormat { get; set; }
        public float CameraStartX { get; set; }
        public float CameraStartY { get; set; }
        public float CameraStartZ { get; set; }
        public float CameraTargetX { get; set; }
        public float CameraTargetY { get; set; }
        public float CameraTargetZ { get; set; }
        public float AmbientLightIntensity { get; set; }
        public bool EnableVR { get; set; }
        public int PointsOfInterestCount { get; set; } 
        public List<POIResponse> PointsOfInterest { get; set; } 


    }
}
