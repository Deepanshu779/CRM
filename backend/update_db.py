import sqlite3
conn = sqlite3.connect('database.db')
conn.execute("UPDATE user SET photo_url = '/avatar.png' WHERE username = 'Deepanshu'")
conn.commit()
conn.close()
