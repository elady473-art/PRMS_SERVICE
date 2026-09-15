export default function TestPage() {
  return (
    <div style={{backgroundColor: 'red', padding: '32px', color: 'white'}}>
      <h1 style={{fontSize: '32px', fontWeight: 'bold'}}>CSS Test Page</h1>
      <p style={{fontSize: '18px', marginTop: '16px'}}>If you can see red background, INLINE CSS is working!</p>
      <div className="bg-blue-500 p-4 mt-4 rounded">
        <p>Blue box with rounded corners - TAILWIND TEST</p>
      </div>
    </div>
  );
}