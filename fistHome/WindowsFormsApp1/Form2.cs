using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WindowsFormsApp1
{
    public partial class Form2 : Form
    {
        public Form2()
        {
            InitializeComponent();
            loadvalue();

        }

        private void loadvalue()
        {
            Configuration config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);
            string ip = config.AppSettings.Settings["host"]?.Value;
            string port = config.AppSettings.Settings["port"]?.Value;
            if (string.IsNullOrWhiteSpace(ip))
            {
                ip = "117.50.74.17";
            }
            if (string.IsNullOrWhiteSpace(port))
            {
                port = "80";
            }
            textBox1.Text = ip;
            textBox2.Text = port;
        }

        private void button2_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Configuration config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);
            string ip = textBox1.Text.Trim();
            string port = textBox2.Text.Trim();
            if (string.IsNullOrWhiteSpace(ip))
            {
                ip = "117.50.74.17";
            }
            if (string.IsNullOrWhiteSpace(port))
            {
                port = "80";
            }
            if (!config.AppSettings.Settings.AllKeys.Contains("host"))
            {
                config.AppSettings.Settings.Add("host", ip);
            }
            else
            {
                config.AppSettings.Settings["host"].Value = ip;
            }

            if (!config.AppSettings.Settings.AllKeys.Contains("port"))
            {
                config.AppSettings.Settings.Add("port", port);
            }
            else
            {
                config.AppSettings.Settings["port"].Value = port;
            }
           
            config.Save();
            this.Close();
        }


        public static string getip()
        {
            Configuration config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);

            string ip = config.AppSettings.Settings["ip"]?.Value;
            if (string.IsNullOrWhiteSpace(ip))
            {
                ip = "117.50.74.17";
            }
            return ip;

        }
        public static string getport()
        {
            Configuration config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);
            string port = config.AppSettings.Settings["port"]?.Value;

            if (port != "80")
            {
                port = ":" + port;
            }
            else {
                port = string.Empty;
            }
            return port;
          
        }


        public static void SetValue(string key,string value) {
            Configuration config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);
            
            if (!config.AppSettings.Settings.AllKeys.Contains(key))
            {
                config.AppSettings.Settings.Add(key, value);
            }
            else
            {
                config.AppSettings.Settings[key].Value = value;
            }
            config.Save();

        }


        public static string GetValue(string key ) {
            Configuration config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);

            string Value = config.AppSettings.Settings[key]?.Value;
            return Value;
        }
    }
}
