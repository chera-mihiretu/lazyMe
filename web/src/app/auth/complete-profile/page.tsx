import CompleteProfileForm from '@/components/complete-profile/CompleteProfileForm';

export default function CompleteProfilePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f7f8fa',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle campus illustration background could go here */}
      <CompleteProfileForm />
    </div>
  );
}
