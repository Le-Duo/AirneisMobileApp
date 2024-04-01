import { View, Text, StyleSheet } from 'react-native';

export default function MessageBox({
  variant = 'info',
  children,
}: {
  variant?: string;
  children: React.ReactNode;
}) {
  const backgroundColor =
    variant === 'danger' ? 'red' : variant === 'success' ? 'green' : 'blue';
  const textColor = variant === 'info' ? 'white' : 'white';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  text: {
    color: 'white',
  },
});