export const Components = {
  Center: ({ children }: { children: React.ReactNode }) => (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flex: 1,
        height: '80vh',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  ),
};
