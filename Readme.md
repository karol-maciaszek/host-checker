Host checker
============

Checks versions of SSH, HTTP and HTTPS servers on remote host. Additionally looks for Wordpress installation.

Usage
-----

```
# node check <hostname/ip>
```

Sample output
-------------

```
Results for blog.chatwee.com:

	SSH (22)		SSH-2.0-OpenSSH_6.0p1 Debian-4+deb7u2
	HTTP (80)		Apache/2.2.22 (Debian) (Wordpress installed)
	HTTP (443)		nginx/1.2.1 (Wordpress installed)
```