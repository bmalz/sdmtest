<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="podsumowanie.aspx.cs" Inherits="SDMFavService.podsumowanie" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Rezerwacja sal - podsumowanie</title>
    <link href="css/style.css" rel="stylesheet" />
    <style type="text/css">
        .ui-widget input { font-size: 10px; }
        .page {
            height: 300px;
        }

        #exim-container {
            width: 600px;
        }

        #locationSelect_1 {
            width: 225px;
        }

    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div id="exim-container">
            <h2 style="text-align:center;">Rezerwacja sali konferencyjnej</h2>
            <div runat="server" class="error"><asp:Label runat="server" ID="errorLabel" /></div>
            <div runat="server" class="warning"><asp:Label runat="server" ID="warningLabel" /></div>
            <div runat="server" class="info"><asp:Label runat="server" ID="infoLabel" /></div>
            <div runat="server" class="success"><asp:Label runat="server" ID="successLabel" /></div>          
        </div>
    </form>
</body>
</html>
