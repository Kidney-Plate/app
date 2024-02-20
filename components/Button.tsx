import { Link } from "expo-router";
import React from "react";
import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  text: string;
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  link?: string;
}

function PrimaryButton(props: Props) {
  return (
    <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#554bab" : "#7265E3",
            transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1}],
          },
          styles.button
        ]}
        onPress={props.onPress}
      >
        <Text className="text-white text-lg text-center font-bold">{props.text}</Text>
      </Pressable>
  );
};

const Button = (props: Props) => {
  if (props.link) {
    return (
      <Link href={props.link} asChild>
        <PrimaryButton onPress={props.onPress} text={props.text} />
      </Link>
    );
  } else {
    return <PrimaryButton onPress={props.onPress} text={props.text} />;
  }
};

export default Button;

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 8,
    marginTop: 16
  },
});
