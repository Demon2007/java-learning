from django.core.management.base import BaseCommand
from lessons.models import Category, Module, Lesson, Quiz, Question
from gamification.models import Title, Achievement, ProfileFrame
from shop.models import ShopItem


class Command(BaseCommand):
    help = "Seed the database with initial data"

    def handle(self, *args, **options):
        self.stdout.write("Seeding database...")
        self.create_titles()
        self.create_achievements()
        self.create_frames()
        self.create_categories()
        self.create_shop_items()
        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))

    def create_titles(self):
        titles = [
            {"name": "Новичок Java", "description": "Только начал путь в мире Java.", "icon": "Sprout", "rarity": "common", "price_coins": 0, "color": "#6b7280", "order": 1, "is_purchasable": False},
            {"name": "Junior Developer", "description": "Освоил основы Java программирования.", "icon": "Code", "rarity": "common", "price_coins": 100, "color": "#3b82f6", "order": 2},
            {"name": "Code Master", "description": "Мастер написания чистого кода.", "icon": "Zap", "rarity": "rare", "price_coins": 300, "color": "#8b5cf6", "order": 3},
            {"name": "Bug Hunter", "description": "Охотник за багами — ни один баг не уйдёт.", "icon": "Bug", "rarity": "rare", "price_coins": 500, "color": "#ef4444", "order": 4},
            {"name": "Java Samurai", "description": "Самурай Java, воин чистого кода.", "icon": "Sword", "rarity": "epic", "price_coins": 1000, "color": "#f59e0b", "order": 5},
            {"name": "Backend Lord", "description": "Повелитель бэкенда и архитектуры.", "icon": "Server", "rarity": "epic", "price_coins": 1500, "color": "#10b981", "order": 6},
            {"name": "Algorithm King", "description": "Король алгоритмов и структур данных.", "icon": "Crown", "rarity": "legendary", "price_coins": 3000, "color": "#f97316", "order": 7},
        ]
        for t in titles:
            Title.objects.get_or_create(name=t["name"], defaults=t)
        self.stdout.write("  Titles created.")

    def create_achievements(self):
        achievements = [
            {"name": "Первый шаг", "description": "Пройди свой первый урок.", "icon": "Play", "xp_reward": 50, "coin_reward": 25, "condition_type": "lessons_completed", "condition_value": 1},
            {"name": "На старт!", "description": "Зайди на платформу первый раз.", "icon": "LogIn", "xp_reward": 25, "coin_reward": 10, "condition_type": "first_login", "condition_value": 1},
            {"name": "5 уроков", "description": "Пройди 5 уроков.", "icon": "BookOpen", "xp_reward": 100, "coin_reward": 50, "condition_type": "lessons_completed", "condition_value": 5},
            {"name": "20 уроков", "description": "Пройди 20 уроков.", "icon": "GraduationCap", "xp_reward": 300, "coin_reward": 150, "condition_type": "lessons_completed", "condition_value": 20},
            {"name": "Streak 3", "description": "Заходи 3 дня подряд.", "icon": "Flame", "xp_reward": 75, "coin_reward": 30, "condition_type": "streak_days", "condition_value": 3},
            {"name": "Streak 7", "description": "Заходи 7 дней подряд.", "icon": "Flame", "xp_reward": 200, "coin_reward": 100, "condition_type": "streak_days", "condition_value": 7},
            {"name": "100 XP", "description": "Набери 100 очков опыта.", "icon": "Star", "xp_reward": 0, "coin_reward": 20, "condition_type": "xp_earned", "condition_value": 100},
            {"name": "500 XP", "description": "Набери 500 очков опыта.", "icon": "Star", "xp_reward": 0, "coin_reward": 75, "condition_type": "xp_earned", "condition_value": 500},
            {"name": "Идеальный тест", "description": "Пройди тест на 100%.", "icon": "CheckCircle", "xp_reward": 150, "coin_reward": 75, "condition_type": "quiz_perfect", "condition_value": 1},
        ]
        for a in achievements:
            Achievement.objects.get_or_create(name=a["name"], defaults=a)
        self.stdout.write("  Achievements created.")

    def create_frames(self):
        frames = [
            {"name": "Фиолетовый ореол", "description": "Классическая фиолетовая рамка.", "price_coins": 200, "rarity": "common", "color_primary": "#7c3aed", "color_secondary": "#9333ea", "css_gradient": "linear-gradient(135deg, #7c3aed, #9333ea)"},
            {"name": "Золотая корона", "description": "Золотая рамка для лучших игроков.", "price_coins": 500, "rarity": "rare", "color_primary": "#f59e0b", "color_secondary": "#d97706", "css_gradient": "linear-gradient(135deg, #f59e0b, #d97706)"},
            {"name": "Огненный круг", "description": "Пылающая рамка для страстных учеников.", "price_coins": 800, "rarity": "epic", "color_primary": "#ef4444", "color_secondary": "#f97316", "css_gradient": "linear-gradient(135deg, #ef4444, #f97316)"},
            {"name": "Неоновый Matrix", "description": "Зелёная матричная рамка.", "price_coins": 1200, "rarity": "epic", "color_primary": "#10b981", "color_secondary": "#059669", "css_gradient": "linear-gradient(135deg, #10b981, #059669)"},
            {"name": "Legendary Aura", "description": "Легендарная многоцветная рамка.", "price_coins": 2500, "rarity": "legendary", "color_primary": "#a855f7", "color_secondary": "#ec4899", "css_gradient": "linear-gradient(135deg, #a855f7, #ec4899, #f97316)"},
        ]
        for f in frames:
            ProfileFrame.objects.get_or_create(name=f["name"], defaults=f)
        self.stdout.write("  Frames created.")

    def create_categories(self):
        cat1, _ = Category.objects.get_or_create(
            slug="java-basics",
            defaults={"name": "Java Basics", "description": "Фундамент Java: синтаксис, типы данных, операторы.", "icon": "Code", "color": "#7c3aed", "order": 1}
        )
        cat2, _ = Category.objects.get_or_create(
            slug="oop-java",
            defaults={"name": "ООП в Java", "description": "Объектно-ориентированное программирование: классы, наследование, полиморфизм.", "icon": "Layers", "color": "#2563eb", "order": 2}
        )
        cat3, _ = Category.objects.get_or_create(
            slug="advanced-java",
            defaults={"name": "Advanced Java", "description": "Продвинутые темы: потоки, коллекции, дженерики, лямбды.", "icon": "Zap", "color": "#059669", "order": 3}
        )

        self.create_modules(cat1, cat2, cat3)

    def create_modules(self, cat1, cat2, cat3):
        modules_data = [
            (cat1, "Введение в Java", "История, JVM, первая программа.", 1),
            (cat1, "Типы данных и переменные", "Примитивы, строки, операторы.", 2),
            (cat1, "Управляющие структуры", "if/else, циклы, switch.", 3),
            (cat2, "Классы и объекты", "Создание классов, конструкторы, методы.", 1),
            (cat2, "Наследование и полиморфизм", "extends, super, override, interface.", 2),
            (cat3, "Коллекции Java", "List, Map, Set, Iterator.", 1),
            (cat3, "Лямбды и Stream API", "Функциональное программирование в Java.", 2),
        ]
        modules = []
        for cat, title, desc, order in modules_data:
            m, _ = Module.objects.get_or_create(category=cat, title=title, defaults={"description": desc, "order": order})
            modules.append(m)

        lessons_data = [
            (modules[0], [
                ("Что такое Java?", "java-chto-takoe", self.lesson1_content(), "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, Java!\");\n    }\n}", 50, 10, "beginner", 10, 1),
                ("JVM, JRE, JDK", "java-jvm-jre-jdk", self.lesson2_content(), "// JVM запускает байт-код\n// JRE = JVM + библиотеки\n// JDK = JRE + инструменты разработки", 50, 10, "beginner", 15, 2),
            ]),
            (modules[1], [
                ("Примитивные типы данных", "java-primitives", self.lesson3_content(), "int age = 25;\ndouble price = 99.99;\nboolean isActive = true;\nchar grade = 'A';\nString name = \"Java\";", 60, 12, "beginner", 20, 1),
                ("Строки в Java", "java-strings", self.lesson4_content(), "String s = \"Hello\";\nSystem.out.println(s.length());      // 5\nSystem.out.println(s.toUpperCase()); // HELLO\nSystem.out.println(s.substring(1,3)); // el", 60, 12, "beginner", 20, 2),
            ]),
            (modules[2], [
                ("Условные операторы if/else", "java-if-else", self.lesson5_content(), "int score = 85;\nif (score >= 90) {\n    System.out.println(\"A\");\n} else if (score >= 80) {\n    System.out.println(\"B\");\n} else {\n    System.out.println(\"C\");\n}", 70, 14, "beginner", 20, 1),
                ("Циклы for и while", "java-loops", self.lesson6_content(), "for (int i = 0; i < 5; i++) {\n    System.out.println(\"i = \" + i);\n}\n\nint n = 10;\nwhile (n > 0) {\n    System.out.print(n + \" \");\n    n -= 2;\n}", 70, 14, "beginner", 25, 2),
            ]),
            (modules[3], [
                ("Создание классов", "java-classes", self.lesson7_content(), "public class Car {\n    String brand;\n    int speed;\n\n    public Car(String brand, int speed) {\n        this.brand = brand;\n        this.speed = speed;\n    }\n\n    public void accelerate() {\n        speed += 10;\n    }\n}", 80, 16, "intermediate", 25, 1),
                ("Инкапсуляция и геттеры/сеттеры", "java-encapsulation", self.lesson8_content(), "public class BankAccount {\n    private double balance;\n\n    public double getBalance() { return balance; }\n\n    public void deposit(double amount) {\n        if (amount > 0) balance += amount;\n    }\n}", 80, 16, "intermediate", 25, 2),
            ]),
            (modules[4], [
                ("Наследование в Java", "java-inheritance", self.lesson9_content(), "public class Animal {\n    String name;\n    public void speak() { System.out.println(\"...\"); }\n}\n\npublic class Dog extends Animal {\n    @Override\n    public void speak() { System.out.println(\"Woof!\"); }\n}", 90, 18, "intermediate", 30, 1),
            ]),
            (modules[5], [
                ("ArrayList и LinkedList", "java-arraylist", self.lesson10_content(), "import java.util.ArrayList;\n\nArrayList<String> list = new ArrayList<>();\nlist.add(\"Java\");\nlist.add(\"Python\");\nlist.add(\"Go\");\nSystem.out.println(list.get(0)); // Java\nlist.remove(1);\nSystem.out.println(list.size()); // 2", 100, 20, "advanced", 30, 1),
            ]),
            (modules[6], [
                ("Lambda-выражения", "java-lambda", self.lesson11_content(), "import java.util.Arrays;\nimport java.util.List;\n\nList<Integer> nums = Arrays.asList(1, 2, 3, 4, 5);\nnums.stream()\n    .filter(n -> n % 2 == 0)\n    .map(n -> n * n)\n    .forEach(System.out::println);", 120, 24, "advanced", 35, 1),
            ]),
        ]

        for module, lessons_list in lessons_data:
            for lesson_data in lessons_list:
                title, slug, content, code, xp, coins, diff, dur, order = lesson_data
                lesson, created = Lesson.objects.get_or_create(
                    slug=slug,
                    defaults={
                        "module": module, "title": title, "content": content,
                        "code_example": code, "xp_reward": xp, "coin_reward": coins,
                        "difficulty": diff, "duration_minutes": dur, "order": order,
                    }
                )
                if created:
                    self.create_quiz(lesson)

        self.stdout.write("  Categories, modules, lessons created.")

    def create_quiz(self, lesson):
        quiz = Quiz.objects.create(lesson=lesson, title=f"Тест: {lesson.title}", xp_reward=100, coin_reward=20)
        questions = self.get_quiz_questions(lesson.slug)
        for i, q in enumerate(questions):
            Question.objects.create(quiz=quiz, text=q["text"], options=q["options"], correct_answer=q["correct"], explanation=q.get("explanation", ""), order=i)

    def get_quiz_questions(self, slug):
        default = [
            {"text": "Что выводит System.out.println(\"Hello\")?", "options": ["Hello", "hello", "HELLO", "Ошибка"], "correct": 0, "explanation": "println выводит строку как есть."},
            {"text": "Какой тип данных хранит целые числа в Java?", "options": ["double", "int", "String", "boolean"], "correct": 1, "explanation": "int — примитивный тип для целых чисел."},
            {"text": "Как объявить константу в Java?", "options": ["const int X = 5;", "final int X = 5;", "static int X = 5;", "var int X = 5;"], "correct": 1, "explanation": "Ключевое слово final делает переменную константой."},
        ]
        return default

    def create_shop_items(self):
        titles = Title.objects.filter(is_purchasable=True)
        for title in titles:
            ShopItem.objects.get_or_create(
                name=title.name,
                defaults={"description": title.description, "item_type": "title", "title": title, "price_coins": title.price_coins, "is_available": True}
            )
        frames = ProfileFrame.objects.all()
        for frame in frames:
            ShopItem.objects.get_or_create(
                name=frame.name,
                defaults={"description": frame.description, "item_type": "frame", "frame": frame, "price_coins": frame.price_coins, "is_available": True}
            )
        self.stdout.write("  Shop items created.")

    def lesson1_content(self):
        return """# Что такое Java?

Java — это объектно-ориентированный язык программирования, разработанный компанией Sun Microsystems (ныне Oracle) в 1995 году.

## Ключевые особенности

- **Платформонезависимость** — "Write Once, Run Anywhere" (WORA)
- **Объектно-ориентированный** — всё является объектом
- **Строго типизированный** — типы данных проверяются на этапе компиляции
- **Безопасный** — нет прямого доступа к памяти (сборщик мусора)

## Как работает Java?

```
Исходный код (.java) → Компилятор → Байт-код (.class) → JVM → Выполнение
```

Java-программа компилируется не в машинный код, а в промежуточный **байт-код**, который запускается на **Java Virtual Machine (JVM)**.

## Первая программа

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

Разбор:
- `public class HelloWorld` — объявление класса
- `public static void main(String[] args)` — точка входа в программу
- `System.out.println()` — вывод текста в консоль

## Применение Java

Java используется повсюду:
- Бэкенд веб-приложений (Spring Boot)
- Android-разработка
- Корпоративные системы
- Big Data (Hadoop, Spark)
"""

    def lesson2_content(self):
        return """# JVM, JRE и JDK

Понимание трёх компонентов Java-экосистемы критически важно.

## JVM (Java Virtual Machine)

**JVM** — виртуальная машина, которая выполняет байт-код Java.

Функции JVM:
- Загрузка и верификация байт-кода
- Интерпретация и JIT-компиляция
- **Управление памятью** (Garbage Collection)
- Обеспечение безопасности

## JRE (Java Runtime Environment)

**JRE = JVM + стандартные библиотеки Java**

Содержит всё необходимое для **запуска** Java-программ, но НЕ для их разработки.

## JDK (Java Development Kit)

**JDK = JRE + инструменты разработчика**

Включает:
- `javac` — компилятор Java
- `java` — запуск программ
- `javadoc` — генерация документации
- `jar` — создание архивов
- Отладчик и профилировщик

## Итог

```
JDK ⊃ JRE ⊃ JVM
```

Для разработки нужен **JDK**. Для запуска достаточно **JRE**.
"""

    def lesson3_content(self):
        return """# Примитивные типы данных

Java имеет 8 примитивных типов данных.

## Целочисленные типы

| Тип | Размер | Диапазон |
|-----|--------|----------|
| `byte` | 1 байт | -128 до 127 |
| `short` | 2 байта | -32768 до 32767 |
| `int` | 4 байта | ~±2 миллиарда |
| `long` | 8 байт | ~±9×10¹⁸ |

## Числа с плавающей точкой

| Тип | Размер | Точность |
|-----|--------|----------|
| `float` | 4 байта | ~7 знаков |
| `double` | 8 байт | ~15 знаков |

## Другие типы

- `boolean` — `true` или `false`
- `char` — один символ Unicode (2 байта)

## Примеры объявления

```java
int age = 25;
long population = 8_000_000_000L;  // суффикс L для long
double pi = 3.14159265;
float price = 9.99f;              // суффикс f для float
boolean isJavaFun = true;
char letter = 'A';
```

## Автоматическое преобразование типов

```java
int x = 100;
long y = x;     // widening — безопасно
double z = x;   // widening — безопасно

double a = 3.14;
int b = (int) a;  // casting — нужно явное приведение, дробная часть теряется
```
"""

    def lesson4_content(self):
        return """# Строки в Java (String)

`String` — один из самых используемых типов в Java. Строки **неизменяемы** (immutable).

## Создание строк

```java
String s1 = "Hello";                    // строковый литерал
String s2 = new String("Hello");         // через конструктор (редко)
```

## Основные методы

```java
String s = "Hello, Java!";

s.length()          // 12 — длина строки
s.charAt(0)         // 'H' — символ по индексу
s.indexOf("Java")   // 7 — позиция подстроки
s.toUpperCase()     // "HELLO, JAVA!"
s.toLowerCase()     // "hello, java!"
s.trim()            // убирает пробелы по краям
s.replace("Java", "World")  // "Hello, World!"
s.split(", ")       // ["Hello", "Java!"]
s.contains("Java")  // true
s.startsWith("He")  // true
s.substring(7, 11)  // "Java"
```

## Конкатенация строк

```java
String first = "Java";
String last = "Quest";
String full = first + " " + last;  // "Java Quest"

// Эффективнее для многих операций:
StringBuilder sb = new StringBuilder();
sb.append("Java");
sb.append(" ");
sb.append("Quest");
String result = sb.toString();
```

## Сравнение строк

```java
String a = "hello";
String b = "hello";

a == b          // сравнивает ссылки (НЕ рекомендуется для строк)
a.equals(b)     // сравнивает содержимое ✓
a.equalsIgnoreCase(b)  // без учёта регистра ✓
```
"""

    def lesson5_content(self):
        return """# Условные операторы if/else

Управление потоком выполнения — основа любой программы.

## Синтаксис if/else

```java
if (условие) {
    // выполняется если условие true
} else if (другое_условие) {
    // альтернатива
} else {
    // если ни одно условие не выполнено
}
```

## Операторы сравнения

| Оператор | Значение |
|----------|----------|
| `==` | равно |
| `!=` | не равно |
| `>` | больше |
| `<` | меньше |
| `>=` | больше или равно |
| `<=` | меньше или равно |

## Логические операторы

- `&&` — AND (оба условия true)
- `||` — OR (хотя бы одно true)
- `!` — NOT (инверсия)

## Тернарный оператор

```java
int age = 20;
String status = age >= 18 ? "взрослый" : "несовершеннолетний";
```

## Switch statement

```java
int day = 3;
switch (day) {
    case 1: System.out.println("Понедельник"); break;
    case 2: System.out.println("Вторник"); break;
    case 3: System.out.println("Среда"); break;
    default: System.out.println("Другой день");
}
```
"""

    def lesson6_content(self):
        return """# Циклы в Java

Циклы позволяют выполнять блок кода многократно.

## Цикл for

Используй, когда знаешь количество итераций:

```java
for (инициализация; условие; обновление) {
    // тело цикла
}

for (int i = 0; i < 10; i++) {
    System.out.println(i);
}
```

## Цикл while

Используй, когда условие проверяется до выполнения:

```java
int n = 1;
while (n <= 100) {
    System.out.println(n);
    n *= 2;
}
```

## Цикл do-while

Тело выполняется хотя бы один раз:

```java
int count = 0;
do {
    System.out.println("Итерация " + count);
    count++;
} while (count < 3);
```

## For-each (Enhanced for)

Для перебора массивов и коллекций:

```java
int[] numbers = {1, 2, 3, 4, 5};
for (int num : numbers) {
    System.out.println(num);
}
```

## Управление циклом

- `break` — выход из цикла
- `continue` — переход к следующей итерации

```java
for (int i = 0; i < 10; i++) {
    if (i == 5) break;    // остановится на 5
    if (i % 2 == 0) continue;  // пропустит чётные
    System.out.println(i);
}
```
"""

    def lesson7_content(self):
        return """# Классы и объекты

ООП — основа Java. Класс — это шаблон, объект — его экземпляр.

## Объявление класса

```java
public class Person {
    // Поля (атрибуты)
    String name;
    int age;
    
    // Конструктор
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // Методы
    public void greet() {
        System.out.println("Привет, я " + name);
    }
    
    public int getAge() {
        return age;
    }
}
```

## Создание объектов

```java
Person alice = new Person("Alice", 30);
Person bob = new Person("Bob", 25);

alice.greet();     // Привет, я Alice
System.out.println(bob.getAge());  // 25
```

## Ключевое слово this

`this` ссылается на текущий объект:

```java
public class Rectangle {
    int width, height;
    
    public Rectangle(int width, int height) {
        this.width = width;   // this.width — поле класса
        this.height = height; // width — параметр метода
    }
    
    public int area() {
        return this.width * this.height;
    }
}
```
"""

    def lesson8_content(self):
        return """# Инкапсуляция

Инкапсуляция — скрытие внутренних деталей и предоставление публичного интерфейса.

## Модификаторы доступа

| Модификатор | Класс | Пакет | Подкласс | Везде |
|-------------|-------|-------|----------|-------|
| `private` | ✓ | ✗ | ✗ | ✗ |
| `default` | ✓ | ✓ | ✗ | ✗ |
| `protected` | ✓ | ✓ | ✓ | ✗ |
| `public` | ✓ | ✓ | ✓ | ✓ |

## Геттеры и сеттеры

```java
public class Student {
    private String name;
    private int grade;
    
    // Геттер
    public String getName() {
        return name;
    }
    
    // Сеттер с валидацией
    public void setGrade(int grade) {
        if (grade >= 0 && grade <= 100) {
            this.grade = grade;
        } else {
            throw new IllegalArgumentException("Оценка должна быть от 0 до 100");
        }
    }
}
```
"""

    def lesson9_content(self):
        return """# Наследование в Java

Наследование позволяет создавать новые классы на основе существующих.

## Синтаксис

```java
public class Родитель {
    // поля и методы
}

public class Потомок extends Родитель {
    // дополнительные поля и методы
}
```

## Пример иерархии

```java
public class Shape {
    String color;
    
    public Shape(String color) {
        this.color = color;
    }
    
    public double area() {
        return 0;
    }
}

public class Circle extends Shape {
    double radius;
    
    public Circle(String color, double radius) {
        super(color);  // вызов конструктора родителя
        this.radius = radius;
    }
    
    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}
```

## Полиморфизм

```java
Shape s1 = new Circle("red", 5);
Shape s2 = new Rectangle("blue", 4, 6);

System.out.println(s1.area());  // вызывается метод Circle
System.out.println(s2.area());  // вызывается метод Rectangle
```
"""

    def lesson10_content(self):
        return """# Коллекции Java: List

Коллекции — динамические структуры данных для хранения объектов.

## ArrayList

`ArrayList` — динамический массив, быстрый доступ по индексу.

```java
import java.util.ArrayList;
import java.util.List;

List<String> languages = new ArrayList<>();
languages.add("Java");
languages.add("Python");
languages.add("Go");
languages.add("Rust");

System.out.println(languages.get(0));  // Java
System.out.println(languages.size());  // 4

languages.remove("Python");
languages.remove(0);  // удалить по индексу

// Перебор
for (String lang : languages) {
    System.out.println(lang);
}
```

## HashMap

`HashMap` — хранение пар ключ-значение.

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> scores = new HashMap<>();
scores.put("Alice", 95);
scores.put("Bob", 87);
scores.put("Charlie", 92);

System.out.println(scores.get("Alice"));      // 95
System.out.println(scores.containsKey("Bob")); // true

for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}
```
"""

    def lesson11_content(self):
        return """# Lambda-выражения и Stream API

Java 8 принёс функциональное программирование в Java.

## Lambda-выражения

Лямбда — анонимная функция:

```java
// Обычный синтаксис
(параметры) -> { тело }

// Примеры
Runnable r = () -> System.out.println("Hello!");
Comparator<Integer> cmp = (a, b) -> a - b;
Function<String, Integer> len = s -> s.length();
```

## Stream API

Stream — последовательность элементов для обработки:

```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// Найти чётные числа, умножить на 2, собрать в список
List<Integer> result = numbers.stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * 2)
    .collect(Collectors.toList());

System.out.println(result);  // [4, 8, 12, 16, 20]

// Сумма
int sum = numbers.stream().mapToInt(Integer::intValue).sum();

// Максимум
Optional<Integer> max = numbers.stream().max(Integer::compareTo);
```
"""
