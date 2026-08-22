using System;
using System.Diagnostics;
using System.IO;
using System.Net.Sockets;
using System.Threading;
using System.Windows.Forms;
using System.Drawing;

namespace VTuberSubtitleStudio
{
    static class Program
    {
        private static Process serverProcess;
        private static NotifyIcon trayIcon;
        private static int activePort = 18890;

        [STAThread]
        static void Main()
        {
            try
            {
                Process.GetCurrentProcess().PriorityClass = ProcessPriorityClass.High;
            }
            catch {}

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            string appDir = AppDomain.CurrentDomain.BaseDirectory;
            string serverExe = Path.Combine(appDir, "vtuber-subtitle-server.exe");

            // 1. Launch Bun backend server
            if (File.Exists(serverExe))
            {
                try
                {
                    ProcessStartInfo startInfo = new ProcessStartInfo
                    {
                        FileName = serverExe,
                        WorkingDirectory = appDir,
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        WindowStyle = ProcessWindowStyle.Hidden,
                    };
                    serverProcess = Process.Start(startInfo);
                    if (serverProcess != null)
                    {
                        try { serverProcess.PriorityClass = ProcessPriorityClass.High; } catch {}
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Could not start VTuber Subtitle Engine: " + ex.Message, "VTuber Studio", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
            }

            // 2. Active Socket Readiness Probe (waits until server is 100% listening)
            string portFilePath = Path.Combine(appDir, "active_port.txt");

            for (int i = 0; i < 50; i++) // up to 5 seconds
            {
                if (File.Exists(portFilePath))
                {
                    try
                    {
                        string txt = File.ReadAllText(portFilePath).Trim();
                        int p;
                        if (int.TryParse(txt, out p))
                        {
                            activePort = p;
                        }
                    }
                    catch {}
                }

                if (IsPortListening("127.0.0.1", activePort))
                {
                    break;
                }

                Thread.Sleep(100);
            }

            // 3. Launch Native Chromium Desktop App Window at 1920x1080
            LaunchAppWindow(activePort);

            // 4. Setup System Tray Icon to keep application lifecycle alive
            string iconPath = Path.Combine(appDir, "app.ico");
            Icon appIcon = null;
            if (File.Exists(iconPath))
            {
                try { appIcon = new Icon(iconPath); } catch {}
            }
            if (appIcon == null)
            {
                appIcon = SystemIcons.Application;
            }

            ContextMenu trayMenu = new ContextMenu();
            trayMenu.MenuItems.Add("🌸 VTuber AI Subtitle Studio Pro (Made By Lumichandesu)").Enabled = false;
            trayMenu.MenuItems.Add("-");
            trayMenu.MenuItems.Add("🖥️ Open Studio GUI (1920x1080)", (s, e) => LaunchAppWindow(activePort));
            trayMenu.MenuItems.Add("📺 Copy OBS Overlay URL", (s, e) => {
                Clipboard.SetText("http://127.0.0.1:" + activePort + "/overlay");
                trayIcon.ShowBalloonTip(2000, "VTuber Subtitle Studio", "OBS Overlay URL copied to clipboard!", ToolTipIcon.Info);
            });
            trayMenu.MenuItems.Add("-");
            trayMenu.MenuItems.Add("❌ Exit Studio", (s, e) => {
                CleanupAndExit();
            });

            trayIcon = new NotifyIcon
            {
                Text = "VTuber AI Subtitle Studio (Port " + activePort + ")",
                Icon = appIcon,
                ContextMenu = trayMenu,
                Visible = true
            };

            trayIcon.DoubleClick += (s, e) => LaunchAppWindow(activePort);

            // Run Windows Application Message Loop
            Application.Run();
        }

        private static void LaunchAppWindow(int port)
        {
            string targetUrl = "http://127.0.0.1:" + port;
            bool appLaunched = false;

            string[] browserPaths = new string[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Microsoft\Edge\Application\msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Microsoft\Edge\Application\msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Google\Chrome\Application\chrome.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Google\Chrome\Application\chrome.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Microsoft\Edge\Application\msedge.exe"),
            };

            foreach (string bPath in browserPaths)
            {
                if (File.Exists(bPath))
                {
                    try
                    {
                        ProcessStartInfo psi = new ProcessStartInfo
                        {
                            FileName = bPath,
                            Arguments = "--app=" + targetUrl + " --window-size=1920,1080 --enable-gpu-rasterization --high-priority-internal-threads",
                            UseShellExecute = false
                        };
                        Process.Start(psi);
                        appLaunched = true;
                        break;
                    }
                    catch {}
                }
            }

            if (!appLaunched)
            {
                try
                {
                    Process.Start(new ProcessStartInfo(targetUrl) { UseShellExecute = true });
                }
                catch {}
            }
        }

        private static void CleanupAndExit()
        {
            if (trayIcon != null)
            {
                trayIcon.Visible = false;
                trayIcon.Dispose();
            }

            if (serverProcess != null && !serverProcess.HasExited)
            {
                try
                {
                    serverProcess.Kill();
                }
                catch {}
            }

            Application.Exit();
            Environment.Exit(0);
        }

        private static bool IsPortListening(string host, int port)
        {
            try
            {
                using (TcpClient client = new TcpClient())
                {
                    IAsyncResult result = client.BeginConnect(host, port, null, null);
                    bool success = result.AsyncWaitHandle.WaitOne(100);
                    if (success && client.Connected)
                    {
                        client.EndConnect(result);
                        return true;
                    }
                }
            }
            catch {}
            return false;
        }
    }
}
