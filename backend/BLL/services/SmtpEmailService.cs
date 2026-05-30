using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using MimeKit.Text;
using System.Drawing;
using VirtualExcursion.BLL.services.interfaces;
using static System.Net.Mime.MediaTypeNames;

namespace VirtualExcursion.BLL.Services
{
    /// <summary>
    /// Реальная отправка email через SMTP (с использованием MailKit)
    /// </summary>
    public class SmtpEmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<SmtpEmailService> _logger;

        public SmtpEmailService(IConfiguration configuration, ILogger<SmtpEmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendVerificationCodeAsync(string email, string code)
        {
            var smtpSettings = _configuration.GetSection("Smtp");

            var host = smtpSettings["Host"];
            var port = int.Parse(smtpSettings["Port"] ?? "587");
            var username = smtpSettings["Username"];
            var password = smtpSettings["Password"];
            var from = smtpSettings["From"];

            // Создаём письмо
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Virtual Excursion", from));
            message.To.Add(new MailboxAddress("", email));
            message.Subject = "Код подтверждения";

            // HTML-содержимое письма
            message.Body = new TextPart(TextFormat.Html)
            {
                Text = @"<!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset='UTF-8'>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
                            .code { font-size: 32px; font-weight: bold; letter-spacing: 4px; text-align: center; background: #f5f5f5; padding: 15px; border-radius: 8px; font-family: monospace; }
                            .footer { font-size: 12px; color: #888; text-align: center; margin-top: 20px; }
                        </style>
                    </head>
                    <body>
                        <div class='container'>
                            <h2>Подтверждение регистрации</h2>
                            <p>Ваш код подтверждения для входа на платформу <strong>Virtual Excursion</strong>:</p>
                            <div class='code'>" + code + @"</div>
                            <p>Код действителен в течение <strong>5 минут</strong>.</p>
                            <p>Если вы не запрашивали этот код, просто проигнорируйте это письмо.</p>
                            <div class='footer'>
                                <p>© 2025 Virtual Excursion. Все права защищены.</p>
                            </div>
                        </div>
                    </body>
                    </html>"
            };

            try
            {
                using var client = new SmtpClient();

                // Подключаемся к SMTP-серверу
                await client.ConnectAsync(host, port, SecureSocketOptions.StartTls);

                // Аутентифицируемся
                await client.AuthenticateAsync(username, password);

                // Отправляем письмо
                await client.SendAsync(message);

                // Отключаемся
                await client.DisconnectAsync(true);

                _logger.LogInformation("Письмо с кодом подтверждения отправлено на {Email}", email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при отправке письма на {Email}", email);
                throw new InvalidOperationException("Не удалось отправить письмо. Попробуйте позже.", ex);
            }
        }
    }
}