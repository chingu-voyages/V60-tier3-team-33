<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f7f9;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f4f7f9;
            padding-bottom: 40px;
        }
        .main {
            background-color: #ffffff;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            border-spacing: 0;
            color: #334155;
            border-radius: 8px;
            overflow: hidden;
            margin-top: 40px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header {
            background-color: #2563eb;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            font-size: 24px;
            margin: 0;
            font-weight: 700;
            letter-spacing: -0.025em;
        }
        .content {
            padding: 40px;
            line-height: 1.6;
            font-size: 16px;
        }
        .content h2 {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin-top: 0;
            margin-bottom: 16px;
        }
        .content p {
            margin-bottom: 24px;
        }
        .button-wrapper {
            text-align: center;
            margin-bottom: 32px;
        }
        .button {
            background-color: #2563eb;
            color: #ffffff !important;
            padding: 12px 32px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            display: inline-block;
        }
        .footer {
            text-align: center;
            padding: 24px;
            font-size: 14px;
            color: #64748b;
        }
        .divider {
            border-top: 1px solid #e2e8f0;
            margin: 32px 0;
        }
        .subtext {
            font-size: 14px;
            color: #94a3b8;
        }
        .break-all {
            word-break: break-all;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <table class="main">
            <tr>
                <td class="header">
                    <h1>{{ config('app.name') }}</h1>
                </td>
            </tr>
            <tr>
                <td class="content">
                    @if(isset($greeting))
                        <h2>{{ $greeting }}</h2>
                    @endif

                    @foreach($introLines as $line)
                        <p>{{ $line }}</p>
                    @endforeach

                    @if(isset($actionUrl))
                        <div class="button-wrapper">
                            <a href="{{ $actionUrl }}" class="button">{{ $actionText }}</a>
                        </div>
                    @endif

                    @foreach($outroLines as $line)
                        <p>{{ $line }}</p>
                    @endforeach

                    @if(isset($actionUrl))
                        <div class="divider"></div>
                        <p class="subtext">
                            If you're having trouble clicking the "{{ $actionText }}" button, copy and paste the URL below into your web browser:
                            <br>
                            <span class="break-all"><a href="{{ $actionUrl }}">{{ $actionUrl }}</a></span>
                        </p>
                    @endif
                </td>
            </tr>
            <tr>
                <td class="footer">
                    &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
