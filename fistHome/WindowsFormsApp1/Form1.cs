using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net.NetworkInformation;
using System.Text;
using System.Web;
using System.Windows.Forms;

namespace WindowsFormsApp1
{
    public partial class Form1 : Form
    {
        Sunisoft.IrisSkin.SkinEngine s;
        Dictionary<string, string> skins = new Dictionary<string, string>();
        public Form1()
        {
            InitializeComponent();
            s = new Sunisoft.IrisSkin.SkinEngine();
          
            this.tableLayoutPanel1.BackgroundImage = Image.FromFile("bg\\bg1.jpg");
            this.panel1.BackgroundImage = Image.FromFile("bg\\bg2.jpg");
            //new Sunisoft.IrisSkin.SkinEngine().SkinFile = "skins/MacOS.ssk";
            loadMac();
        }

        private void loadMac()
        {

            List<string> macs = new List<string>();
            NetworkInterface[] interfaces = NetworkInterface.GetAllNetworkInterfaces();
            foreach (NetworkInterface ni in interfaces)
            {
                macs.Add(ni.GetPhysicalAddress().ToString());
            }
            comboBox1.Items.AddRange(macs.ToArray());

            if (macs.Count > 0)
            {
                comboBox1.SelectedIndex = 0;

            }
            FileInfo[] fs = new DirectoryInfo("Skins").GetFiles();
            List<string> names = new List<string>();
            foreach (var item in fs)
            {
                names.Add(item.Name);
                skins.Add(item.Name, item.FullName);
            }
            comboBox2.Items.AddRange(names.ToArray());
        }

        private void button1_Click(object sender, System.EventArgs e)
        {
            string user = textBox1.Text.Trim();
            string pwd = textBox2.Text.Trim();
            string mac = comboBox1.Text.Trim();
            if (string.IsNullOrWhiteSpace(user))
            {
                MessageBox.Show("请输入用户名");
                return;
            }
            if (string.IsNullOrWhiteSpace(pwd))
            {
                MessageBox.Show("请输入密码");
                return;
            }
            if (string.IsNullOrWhiteSpace(mac))
            {
                MessageBox.Show("请选择MAC地址");
                return;
            }

            var loginkey = $"u={user}&m={mac}&p={pwd}&t={DateTime.Now.Ticks}";
            loginkey = Security.EncryptStr(loginkey, "kbtech"); // 加¨®密¨¹
                                                                // string vsloginkey = Security.EncryptStr("u=" + strname + "&t=" + DateTime.Now.Ticks.ToString() + "", "kbtech"); // 加¨®密¨¹
            string vsReturnUrl = HttpUtility.UrlEncode("Main.aspx");


            string urlstr = $"http://{Form2.getip()}{Form2.getport()}/ERescue/ERescuelogin.aspx?loginkey={loginkey}&ReturnUrl={vsReturnUrl}";
            //RegistryKey key = Registry.ClassesRoot.OpenSubKey(@"http\shell\open\command\");
            //string s = key.GetValue("").ToString();

            //s就是你的默认浏览器，不过后面带了参数，把它截去，不过需要注意的是：不同的浏览器后面的参数不一样！
            //"D:\Program Files (x86)\Google\Chrome\Application\chrome.exe" -- "%1"
            //Process.Start("iexplore.exe", urlstr);
            //Process.Start("explorer.exe", urlstr);
            
            Process.Start( urlstr);
            
            if (!checkBox1.Checked)
            {
                user = string.Empty;
                pwd = string.Empty;
            }
            Form2.SetValue("user", user);
            Form2.SetValue("pwd", pwd);
            Form2.SetValue("remember", checkBox1.Checked.ToString());
            this.Close();

        }
        /// <summary>
        /// 打开系统默认浏览器（用户自己设置了默认浏览器）
        /// </summary>
        /// <param name="url"></param>
        public static void OpenDefaultBrowserUrl(string url)
        {
            // 方法1
            //从注册表中读取默认浏览器可执行文件路径
            RegistryKey key = Registry.ClassesRoot.OpenSubKey(@"http\shell\open\command\");
            if (key != null)
            {
                string s = key.GetValue("").ToString();
                //s就是你的默认浏览器，不过后面带了参数，把它截去，不过需要注意的是：不同的浏览器后面的参数不一样！
                //"D:\Program Files (x86)\Google\Chrome\Application\chrome.exe" -- "%1"
                var lastIndex = s.IndexOf(".exe", StringComparison.Ordinal);
                if (lastIndex == -1)
                {
                    lastIndex = s.IndexOf(".EXE", StringComparison.Ordinal);
                }
                var path = s.Substring(1, lastIndex + 3);
                var result = Process.Start(path, url);
                if (result == null)
                {
                    // 方法2
                    // 调用系统默认的浏览器 
                    var result1 = Process.Start("explorer.exe", url);
                    if (result1 == null)
                    {
                        // 方法3
                        Process.Start(url);
                    }
                }
            }
            else
            {
                // 方法2
                // 调用系统默认的浏览器 
                var result1 = Process.Start("explorer.exe", url);
                if (result1 == null)
                {
                    // 方法3
                    Process.Start(url);
                }
            }


        }
        private void button2_Click(object sender, EventArgs e)
        {
            this.Close();

        }

        private void button3_Click(object sender, EventArgs e)
        {
            new Form2().ShowDialog();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            textBox1.Text = Form2.GetValue("user");
            textBox2.Text = Form2.GetValue("pwd");

            string remember= Form2.GetValue("remember");
            if (bool.TryParse(remember,out bool R))
            {

            }
            checkBox1.Checked = R; 
        }

        private void comboBox2_SelectedIndexChanged(object sender, EventArgs e)
        {

            s.SkinFile = skins[comboBox2.Text]; 
        }
    }
}
