<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Turboly Task Manager</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    @viteReactRefresh
    @vite(['resources/js/app.tsx'])
</head>
<body>
    <!-- Inject device type dari Laravel Agent ke global window object -->
    <script>
        window.deviceType = "{{ $deviceType }}";
    </script>
    
    <div id="root"></div>
</body>
</html>