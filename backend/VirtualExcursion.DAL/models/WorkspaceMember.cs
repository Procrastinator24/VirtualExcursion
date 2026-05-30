using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.DAL.models
{
    /// <summary>
    /// Участник рабочего пространства
    /// </summary>
    public class WorkspaceMember
    {
        public int WorkspaceId { get; set; }
        public virtual Workspace Workspace { get; set; } = null!;

        public int UserId { get; set; }
        public virtual User User { get; set; } = null!;

        public WorkspaceRole Role { get; set; } = WorkspaceRole.Editor;

        public DateTime JoinedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        /// <summary>
        /// Приглашён пользователем (ID)
        /// </summary>
        public int? InvitedById { get; set; }
        public virtual User? InvitedBy { get; set; }

        /// <summary>
        /// Статус приглашения (если приглашён)
        /// </summary>
        public InvitationStatus? InvitationStatus { get; set; }
    }

    public enum WorkspaceRole
    {
        Viewer,     // Только просмотр контента
        Editor,     // Может создавать/редактировать контент
        Admin       // Управление участниками, настройками
    }

    public enum InvitationStatus
    {
        Pending,
        Accepted,
        Declined
    }
}
