<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #ea580c; padding-bottom: 20px; }
        .logo { font-size: 28px; font-weight: 900; text-transform: uppercase; }
        .logo span { color: #ea580c; }
        .badge { display: inline-block; background: #ea580c; color: white; padding: 6px 16px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
        .section { margin: 24px 0; }
        .section-title { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 900; letter-spacing: 3px; margin-bottom: 12px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .info-item label { font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 4px; }
        .info-item p { font-size: 14px; font-weight: 900; color: #1e293b; margin: 0; }
        .total { background: #1e293b; color: white; padding: 24px; border-radius: 16px; text-align: center; margin-top: 32px; }
        .total .amount { font-size: 36px; font-weight: 900; color: #ea580c; }
        .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">Car <span>Rental</span></div>
        <p style="color:#94a3b8; font-size:11px; text-transform:uppercase; letter-spacing:3px;">Confirmation de Réservation</p>
        <span class="badge">Acceptée</span>
    </div>

    <div class="section">
        <div class="section-title">Référence</div>
        <div class="info-grid">
            <div class="info-item">
                <label>ID Réservation</label>
                <p>#{{ $order->id }}</p>
            </div>
            <div class="info-item">
                <label>Date de confirmation</label>
                <p>{{ $order->updated_at->format('d/m/Y') }}</p>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Client</div>
        <div class="info-grid">
            <div class="info-item">
                <label>Nom</label>
                <p>{{ $order->user->name }}</p>
            </div>
            <div class="info-item">
                <label>Email</label>
                <p>{{ $order->user->email }}</p>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Véhicule</div>
        <div class="info-grid">
            <div class="info-item">
                <label>Marque & Modèle</label>
                <p>{{ $order->car->brand }} {{ $order->car->model }}</p>
            </div>
            <div class="info-item">
                <label>Catégorie</label>
                <p>{{ ucfirst($order->car->category) }}</p>
            </div>
            <div class="info-item">
                <label>Agence</label>
                <p>{{ $order->car->agency_name ?? 'AutoDrive' }}</p>
            </div>
            <div class="info-item">
                <label>Tarif / Jour</label>
                <p>{{ $order->car->price_per_day }} MAD</p>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Période de Location</div>
        <div class="info-grid">
            <div class="info-item">
                <label>Date de départ</label>
                <p>{{ \Carbon\Carbon::parse($order->start_date)->format('d/m/Y') }}</p>
            </div>
            <div class="info-item">
                <label>Date de retour</label>
                <p>{{ \Carbon\Carbon::parse($order->end_date)->format('d/m/Y') }}</p>
            </div>
        </div>
    </div>

    <div class="total">
        <p style="font-size:11px; text-transform:uppercase; letter-spacing:2px; color:#94a3b8; margin:0 0 8px;">Total à Régler en Agence</p>
        <div class="amount">{{ $order->total_price }} MAD</div>
    </div>

    <div class="footer">
        <p>Le paiement s'effectue en agence après inspection du véhicule · CarRental Pro</p>
    </div>
</body>
</html>