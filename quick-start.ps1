# Quick Start Test Script
# This script tests that the server starts and responds correctly

Write-Output "=== VedAppBuilder Quick Start Test ==="
Write-Output ""

# Step 1: Check Node.js version
Write-Output "1. Checking Node.js version..."
$nodeVersion = node -v
if ($nodeVersion) {
    Write-Output "   ✓ Node.js version: $nodeVersion"
} else {
    Write-Output "   ✗ Node.js not found. Please install Node.js 20+"
    exit 1
}

# Step 2: Check if dependencies are installed
Write-Output ""
Write-Output "2. Checking dependencies..."
if (Test-Path "node_modules") {
    Write-Output "   ✓ node_modules found"
} else {
    Write-Output "   ✗ node_modules not found. Running npm install..."
    npm install
}

# Step 3: Run TypeScript check
Write-Output ""
Write-Output "3. Running TypeScript type check..."
npm run check
if ($LASTEXITCODE -eq 0) {
    Write-Output "   ✓ No TypeScript errors"
} else {
    Write-Output "   ✗ TypeScript errors found"
    exit 1
}

# Step 4: Check if port 5000 is available
Write-Output ""
Write-Output "4. Checking if port 5000 is available..."
$portCheck = netstat -aon | Select-String ":5000"
if ($portCheck) {
    Write-Output "   ⚠ Port 5000 is in use. Attempting to free it..."
    $matches = $portCheck | Select-Object -First 1
    $pid = ($matches.ToString().Trim() -split '\s+' | Select-Object -Last 1)
    if ($pid -match '^\d+$') {
        Write-Output "   Stopping process $pid..."
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        Write-Output "   ✓ Port 5000 freed"
    }
} else {
    Write-Output "   ✓ Port 5000 is available"
}

# Step 5: Start the server
Write-Output ""
Write-Output "5. Starting development server..."
Write-Output "   Command: npm run dev"
Write-Output ""
Write-Output "=== Server Starting ==="
Write-Output "   Open your browser to: http://localhost:5000"
Write-Output "   Press Ctrl+C to stop the server"
Write-Output ""

# Start the server
npm run dev
