export default function Guidebook() {
  return (
    <div style={{ paddingBottom: '40px' }}>
      <h1 style={{ marginBottom: '20px', fontSize: '1.8rem', color: 'var(--text-dark)' }}>Guidebook & Maps</h1>
      
      <p style={{ marginBottom: '20px', color: '#555', fontSize: '1.1rem', lineHeight: '1.5' }}>
        Here are the key locations and pins for the trip.
      </p>

      {/* Map Card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        marginBottom: '20px'
      }}>
        <div style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#222' }}>Tatralandia Resort, Slovakia</h3>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9rem' }}>Our main stay from Aug 22 - Aug 28</p>
        </div>
        
        {/* Google Maps Embed */}
        <div style={{ width: '100%', height: '300px' }}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2613.5651036329715!2d19.569421215682855!3d49.10667637931398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47159f81a7b1cb1d%3A0xb3bd6a0dbbe8249b!2sTatralandia!5e0!3m2!1sen!2sil!4v1691653131779!5m2!1sen!2sil" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Tatralandia Resort Map"
          ></iframe>
        </div>
      </div>
      
      {/* Another Card for Budapest */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
      }}>
        <div style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#222' }}>Budapest City Center</h3>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9rem' }}>Aug 20 - 22 & Aug 28 - 29</p>
        </div>
        
        {/* Google Maps Embed for Budapest */}
        <div style={{ width: '100%', height: '200px' }}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d172605.32635905582!2d18.913615306634567!3d47.48112810058864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741c334d1d4cfc9%3A0x400c4290c1e1160!2sBudapest%2C%20Hungary!5e0!3m2!1sen!2sil!4v1691653205000!5m2!1sen!2sil" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Budapest Map"
          ></iframe>
        </div>
      </div>

    </div>
  );
}
