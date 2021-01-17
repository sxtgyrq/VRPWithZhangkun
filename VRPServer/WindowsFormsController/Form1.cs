using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WindowsFormsController
{
    public partial class Form1 : Form
    {
        string url { get; set; }
        public Form1()
        {
            InitializeComponent();
        }

        private void listBox1_SelectedIndexChanged(object sender, EventArgs e)
        {

        }

        private void statusStrip1_ItemClicked(object sender, ToolStripItemClickedEventArgs e)
        {

        }

        private void menuStrip1_ItemClicked(object sender, ToolStripItemClickedEventArgs e)
        {
            //
            // MessageBox.Show("请输入连接地址");
            Promote p = new Promote();
            p.ShowDialog();

            //MessageBox.Show(p.connectUrl);
            //this.toolStripStatusLabel2.Text = p.connectUrl + "  ________";
            //this.toolStripStatusLabel1.Text = p.connectUrl + "  ________";
            this.statusStrip1.Items.Clear();
            this.statusStrip1.Items.Add($"连接{p.connectUrl}");
            this.url = p.connectUrl;
            //TcpFunction.WithResponse.SendInmationToUrlAndGetRes(this.url,
            //    Newtonsoft.Json.JsonConvert.SerializeObject(new { c = "All" }));
        }
    }
}
