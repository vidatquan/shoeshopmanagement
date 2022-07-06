using System;
using System.ComponentModel.DataAnnotations;

namespace AppApi.Entities.Entity
{
    public class User
    {
        public int Id { get; set; }
        [StringLength(50)]
        public string FullName { get; set; }
        [StringLength(50)]
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        [StringLength(25)]
        public string Tel { get; set; }
        [StringLength(25)]
        public string Cmnd { get; set; }
        public byte[] Img { get; set; }
        public int RoleId { get; set; }
        public string ImageString { get; set; }
        public string Address { get; set; }
        public string EmpCode { get; set; }
        public string Token { get; set; }
        public int IsDeleted { get; set; }

    }
}
