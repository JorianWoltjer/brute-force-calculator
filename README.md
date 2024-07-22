# Brute Force Calculator

[brute.jtw.sh](https://brute.jtw.sh/)

**Quickly calculate brute force times from speed and search space in a web UI**

[<img width="775px" src="https://github.com/user-attachments/assets/4bf84846-85b0-412f-abea-c7a865f9792f" alt="Screenshot of default main web UI">](https://brute.jtw.sh/)

So often we hackers face some sort of random string, be it a numeric code, generated token or hash, and wonder how long it would take to brute force. This tool helps you quickly calculate it within a Web UI. Just specify your rate of attempts and the length/character set of the token. This tool will calculate both the number of requests required and an estimated time of completion.  
With the 'Collision' mode, it can even calculate when a collision of two random strings should happen (aka. [Birtday Problem](https://en.wikipedia.org/wiki/Birthday_problem)). These are more functional bugs where two random users may collide, but are much more likely and another reason to increase your token's entropy. 

Most fields explain themselves by giving them a hover or tap. If anything is unclear or you are missing a feature, feel free to ask in an [Issue](https://github.com/JorianWoltjer/brute-force-calculator/issues)!
