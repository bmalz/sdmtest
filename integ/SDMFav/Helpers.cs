using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace SDMFavService
{
    public static class Helpers
    {
        static readonly string PasswordHash = "#Orl3nHa$h";
        static readonly string SaltKey = "#Orl3n$alt";
        static readonly string VIKey = "@1B2c3D4e5F6g7H8";

        public static string Decrypt(string encryptedText)
        {
            byte[] cipherTextBytes = Convert.FromBase64String(encryptedText);
            byte[] keyBytes = new Rfc2898DeriveBytes(PasswordHash, Encoding.ASCII.GetBytes(SaltKey)).GetBytes(256 / 8);
            var symmetricKey = new RijndaelManaged() { Mode = CipherMode.CBC, Padding = PaddingMode.None };

            var decryptor = symmetricKey.CreateDecryptor(keyBytes, Encoding.ASCII.GetBytes(VIKey));
            var memoryStream = new MemoryStream(cipherTextBytes);
            var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read);
            byte[] plainTextBytes = new byte[cipherTextBytes.Length];

            int decryptedByteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
            memoryStream.Close();
            cryptoStream.Close();
            return Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount).TrimEnd("\0".ToCharArray());
        }

        public static string ByteToString(byte[] InputByte)
        {
            byte[] bytes = InputByte;
            StringBuilder sb = new StringBuilder();
            foreach (byte b in bytes)
            {
                sb = sb.Append(b.ToString("X").PadLeft(2, '0'));
            }
            return sb.ToString();
        }

        public static string GetSetting(string SettingName, bool decrypt)
        {
            string p = System.Configuration.ConfigurationManager.AppSettings[SettingName].ToString();
            if (!decrypt)
                return p;
            else
                return Helpers.Decrypt(p);
        }
    }
}