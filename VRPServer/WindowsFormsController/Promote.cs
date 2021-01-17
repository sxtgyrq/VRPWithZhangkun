using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace WindowsFormsController
{
    public partial class Promote : Form
    {
        public string connectUrl = "";
        public Promote()
        {
            InitializeComponent();
            this.textBox1.Text = "127.0.0.1:18900";
        }

        private void button1_Click(object sender, EventArgs e)
        {
            this.connectUrl = this.textBox1.Text;
            this.Dispose();
            this.Close();
        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {

        }
    }
}
