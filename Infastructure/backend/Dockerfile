FROM adars47/health_vault_backend:latest

EXPOSE 2222

COPY backend.conf /etc/apache2/sites-enabled/backend.conf
COPY patient.conf /etc/apache2/sites-enabled/patient.conf
COPY publisher.conf /etc/apache2/sites-enabled/publisher.conf


RUN a2enmod php8.1
RUN a2enmod ssl && a2enmod rewrite
RUN a2enmod rewrite headers
RUN service apache2 restart

CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]


