with open('data.json', 'rb') as f:
    content = f.read()

# Remove BOM if present and decode
if content.startswith(b'\xff\xfe'):
    content = content.decode('utf-16')
elif content.startswith(b'\xfe\xff'):
    content = content.decode('utf-16')
else:
    content = content.decode('utf-8')

# Save as proper UTF-8 without BOM
with open('data.json', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done! data.json is now UTF-8 encoded.")