
using System.Data;
using ExcelDataReader;
using Wijnlanden.API.Models.Classes;
using Wijnlanden.API.Models.Enums;

namespace Wijnlanden.API.Services {
    public class ImportService {

        public List<Guest> ImportGuestList() {
            try {
                string fileName = "GuestList.xlsx";
                string filePath = Path.Combine(Environment.CurrentDirectory, @"GuestLists\", fileName);
                var guests = new List<Guest>();
                DataSet results;
                if (!File.Exists(filePath)) return guests;
                System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
                using (var stream = File.Open(filePath, FileMode.Open, FileAccess.Read)) {
                    using (var reader = ExcelReaderFactory.CreateReader(stream)) {
                        do {
                            while (reader.Read()) {
                            }
                        } while (reader.NextResult());
                        results = reader.AsDataSet();
                    }
                }

                if (results is null || results.Tables.Count == 0) return guests;
                var firstSheet = results.Tables[0];
                var rows = firstSheet.Rows;
                var importGuests = new List<ImportGuest>();

                interpretRows(importGuests, rows);


                foreach (var importGuest in importGuests) {
                    if (!string.IsNullOrWhiteSpace(importGuest.PartnerID)) {
                        var partner = importGuests.FirstOrDefault(g => g.ID == importGuest.PartnerID);
                        if (partner is not null) {
                            importGuest.Guest.Partner = partner.Guest;
                        }
                    }
                    guests.Add(importGuest.Guest);
                }
                string destFilePath = Path.Combine(Environment.CurrentDirectory, @"GuestLists\Completed\", fileName);
                File.Move(filePath, destFilePath);
                return guests;
            } catch (Exception) {

                throw;
            }
        }

        private void interpretRows(List<ImportGuest> importGuests, DataRowCollection rows) {
            for (int i = 0; i < rows.Count; i++) {
                if (i == 0) {
                    //Header Row
                    continue;
                } else {
                    var currentRow = rows[i].ItemArray;

                    if (currentRow is not null && currentRow.Length > 0) {
                        importGuests.Add(createGuestFromRow(currentRow!));
                    }
                }
            }
        }

        private ImportGuest createGuestFromRow(object[] row) {
            var nameRow = row[1].ToString();
            var surnameRow = row[2].ToString();
            var allowPlusOneRow = row[4].ToString();
            var provinceRow = row[5].ToString();
            var relationRow = row[6].ToString();
            var guest = new Guest();

            if (nameRow is not null) {
                guest.Name = nameRow;
            }
            if (surnameRow is not null) {
                guest.Surname = surnameRow;
            }
            if (allowPlusOneRow is not null) {
                guest.AllowPlusOne = allowPlusOneRow.Equals("yes", StringComparison.InvariantCultureIgnoreCase);
            }
            if (provinceRow is not null) {
                if (Enum.TryParse(provinceRow, out Province province)) {
                    guest.Province = province;
                }
            }
            if (relationRow is not null) {
                if (Enum.TryParse(relationRow, out Relation relation)) {
                    guest.Relation = relation;
                }
            }
            var import = new ImportGuest(guest);
            import.ID = row[0].ToString()!;
            if (row[3] is not null && !string.IsNullOrWhiteSpace(row[3].ToString())) {
                import.PartnerID = row[3].ToString();
            }

            return import;
        }
    }
}
