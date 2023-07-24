import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";

type row = {
  value: any;
  label: string;
  alternativeText?: string;
};

type CardDetailProps = {
  title: string;
  list: row[];
};

const CardDetail = ({ title, list }: CardDetailProps) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          {list.map((row) => (
            <IonItem key={`${row.label}${row.value}`}>
              <IonLabel className="ion-text-wrap">
                <h3>{row.label}</h3>
                <p>{row.value || row.alternativeText}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default CardDetail;
