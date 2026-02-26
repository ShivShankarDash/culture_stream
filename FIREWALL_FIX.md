# Firewall Configuration - Culture Stream Deployment

## Issue
Ports 4000 and 5556 were not accessible from external machines due to UFW firewall rules.

## Solution Applied (Feb 26, 2026 - 12:36 PM UTC)

### Rules Added
```bash
sudo ufw allow 4000/tcp   # Backend API
sudo ufw allow 5556/tcp   # Frontend UI
```

Both IPv4 and IPv6 rules automatically created.

### Verification
```bash
sudo ufw status | grep -E "(4000|5556)"

Output:
4000/tcp                   ALLOW       Anywhere                  
5556/tcp                   ALLOW       Anywhere                  
4000/tcp (v6)              ALLOW       Anywhere (v6)             
5556/tcp (v6)              ALLOW       Anywhere (v6)
```

## Current Firewall Rules (After Fix)

```
18789/tcp   ALLOW    Anywhere  (OpenClaw Gateway)
3000/tcp    ALLOW    Anywhere  (Kaziren Backend API)
22/tcp      ALLOW    Anywhere  (SSH)
8080/tcp    ALLOW    Anywhere  (Kaziren Frontend)
9000/tcp    ALLOW    Anywhere  (Culture Stream Dashboard)
5555/tcp    ALLOW    Anywhere  (Flashcard Server)
7000/tcp    ALLOW    Anywhere  (Kaziren Frontend)
4000/tcp    ALLOW    Anywhere  (Culture Stream Backend API) ← NEW
5556/tcp    ALLOW    Anywhere  (Culture Stream Frontend UI) ← NEW
```

## Access URLs (Now Working ✅)

**Backend Health Check:**
```
http://51.83.161.70:4000/health
```

**Frontend Demo:**
```
http://51.83.161.70:5556
```

## Testing Results

✅ Backend API responding: `{"status":"ok", ...}`
✅ Frontend UI loading: `<title>Culture Stream - Real-Time Culture Mutation Detector</title>`
✅ Both ports accessible externally

## Future Firewall Considerations

If adding new ports, use:
```bash
sudo ufw allow <PORT>/tcp
sudo ufw reload
```

Current firewall is set to `default: deny` incoming, `default: allow` outgoing (secure configuration).
