using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.DAL.models
{
    public class ExcursionTag
    {
        public int ExcursionId { get; set; }
        public virtual Excursion Excursion { get; set; } = null!;

        public int TagId { get; set; }
        public virtual Tag Tag { get; set; } = null!;
    }
}
